const express = require('express');

const router = express.Router();
const reddit = require('./reddit');
const config = require('./config');
const db = require('./mongo');

router.get('/test', (req, res) => {
  res.json({ data: 'Hello world!' });
});
router.get('/valid/subreddit/:subredditName', (req, res) => {
  reddit
    .getSubreddit(req.params.subredditName)
    .fetch()
    .then(() => res.status(200).send({}))
    .catch(() => res.sendStatus(404));
});

function hasProp(object, propertyName) {
  return (
    Object.prototype.hasOwnProperty.call(object, propertyName)
    && object[propertyName] !== null
    && object[propertyName] !== undefined
  );
}

function isValidThumbnail(thumbnail) {
  return thumbnail.length > 0 && thumbnail !== 'default' && thumbnail !== 'nsfw';
}

function getSubmissionPreviewImageUrls(submission) {
  const imageUrls = [];

  if (hasProp(submission, 'preview')) {
    const { preview } = submission;
    if (hasProp(preview, 'images')) {
      const { images } = preview;
      // mostly arbitrary, since there's no official documentation on preview image resolutions
      const previewImages = images[0].resolutions;
      const MAX_PREVIEW_RESOLUTION_INDEX = 3;

      let previewImage;
      if (previewImages.length > 0) {
        previewImage = previewImages[
          Math.min(previewImages.length - 1, MAX_PREVIEW_RESOLUTION_INDEX)
        ].url;
      } else {
        previewImage = images[0].source.url;
      }
      imageUrls.push(previewImage);
    }
  } else if (hasProp(submission, 'is_gallery') && submission.is_gallery) {
    if (hasProp(submission, 'gallery_data')) {
      const galleryImages = submission.gallery_data.items;
      galleryImages.forEach((image) => {
        const metadata = submission.media_metadata[image.media_id];
        const previewImages = metadata.p;

        if (previewImages === undefined) {
          return;
        }

        let imagePreview;
        if (previewImages.length > 0) {
          const MAX_PREVIEW_RESOLUTION_INDEX = 3;
          imagePreview = previewImages[
            Math.min(previewImages.length - 1, MAX_PREVIEW_RESOLUTION_INDEX)
          ].u;
        } else {
          imagePreview = metadata.s.u;
        }

        imageUrls.push(imagePreview);
      });
    } else {
      throw new Error(
        `Submission ${submission.url} has is_gallery (${submission.is_gallery}) but does not have gallery_data (${submission.gallery_data})`,
      );
    }
  } else if (hasProp(submission, 'thumbnail')) {
    if (isValidThumbnail(submission.thumbnail)) {
      imageUrls.push(submission.thumbnail);
    }
  }
  return imageUrls;
}

async function getSubmissionPreviewImagesWrapper(submission) {
  // try fetching if ambiguous whether it is image post
  // currently ambiguous if the submission is not a
  //   text post (is_self)
  //   post with previews (preview)
  //   gallery post (is_gallery == true and gallery_data != null)
  if (
    !submission.is_self
    && !(
      hasProp(submission, 'preview') && hasProp(submission.preview, 'images')
    )
    && !(
      hasProp(submission, 'is_gallery')
      && submission.is_gallery
      && hasProp(submission, 'gallery_data')
    )
  ) {
    await submission.fetch().then((updatedSubmission) => {
      console.log(
        `Fetching data for ambiguous image post: ${submission.title}, ${submission.url}`,
      );
      submission = updatedSubmission;
    });
  }
  return getSubmissionPreviewImageUrls(submission);
}

function getMedia(submission) {
  if (hasProp(submission, 'media_embed')) {
    const { media_embed } = submission;
    if (hasProp(media_embed, 'content')) {
      return { type: 'embed', media: media_embed.content };
    }
  }

  if (hasProp(submission, 'media')) {
    const { media } = submission;
    if (hasProp(media, 'oembed')) {
      const { oembed } = media;
      if (hasProp(oembed, 'html')) {
        return { type: 'html', media: oembed.html };
      } if (hasProp(oembed, 'thumbnail_url')) {
        return { type: 'thumbnail', media: oembed.thumbnail_url };
      }
    } else if (hasProp(media, 'reddit_video')) {
      const { reddit_video } = media;
      if (hasProp(reddit_video, 'fallback_url')) {
        return { type: 'video', media: reddit_video.fallback_url };
      }
    }
  }

  if (hasProp(submission, 'preview')) {
    const { preview } = submission;
    if (hasProp(preview, 'reddit_video_preview')) {
      const { reddit_video_preview } = preview;
      if (hasProp(reddit_video_preview, 'fallback_url')) {
        return { type: 'video', media: reddit_video_preview.fallback_url };
      }
    }
  }

  return null;
}

async function getMediaWrapper(submission) {
  if (
    !submission.is_self
    && !(
      hasProp(submission, 'media_embed')
      && hasProp(submission.media_embed, 'content')
    )
    && !(
      hasProp(submission, 'media')
      && ((hasProp(submission.media, 'oembed')
        && (hasProp(submission.media.oembed, 'html')
          || hasProp(submission.media.oembed, 'thumbnail_url')))
        || (hasProp(submission.media, 'reddit_video')
          && hasProp(submission.media.reddit_video, 'fallback_url')))
    )
    && !(
      hasProp(submission, 'preview')
      && hasProp(submission.preview, 'reddit_video_preview')
      && hasProp(submission.preview.reddit_video_preview, 'fallback_url')
    )
  ) {
    await submission.fetch().then((updatedSubmission) => {
      console.log(
        `Fetching data for ambiguous media post: ${submission.title}, ${submission.url}`,
      );
      submission = updatedSubmission;
    });
  }
  return getMedia(submission);
}

function addMediaData(submission, mediaObject) {
  if (mediaObject !== null) {
    switch (mediaObject.type) {
      case 'embed':
        submission.mediaHtml = mediaObject.media;
        break;
      case 'html':
        submission.mediaHtml = mediaObject.media;
        break;
      case 'thumbnail':
        submission.mediaHtml = mediaObject.media;
        break;
      case 'video':
        submission.mediaVideo = mediaObject.media;
        break;
      default:
        throw new Error(`Invalid media type: ${mediaObject}`);
    }
  }
}

function updateSubmissionMedia(submission) {
  if (config.fetchAll) {
    return submission.fetch().then((updatedData) => {
      const modifiedSubmission = updatedData;
      const mediaObject = getMedia(modifiedSubmission);
      addMediaData(modifiedSubmission, mediaObject);
      if (mediaObject === null) {
        try {
          modifiedSubmission.imageUrls = getSubmissionPreviewImageUrls(modifiedSubmission);
        } catch (err) {
          console.error(`Error while fetching preview images for ${modifiedSubmission.title} (${modifiedSubmission.url}):`, err);
        }
      }
      return modifiedSubmission;
    });
  }
  return new Promise((resolve, reject) => {
    const mediaObject = getMedia(submission);
    addMediaData(submission, mediaObject);
    if (mediaObject === null) {
      try {
        submission.imageUrls = getSubmissionPreviewImageUrls(submission);
      } catch (err) {
        console.error(`Error while fetching preview images for ${submission.title} (${submission.url}):`, err);
      }
    }
    resolve(submission);
  });
}

function updateSubmissionInDb(submission) {
  const dbConnect = db.getDb();
  const submissionObj = {
    lastUpdateTime: submission.lastUpdateTime,
    imageUrls: submission.imageUrls,
    mediaVideo: submission.mediaVideo,
    mediaHtml: submission.mediaHtml,
    id: submission.id,
    title: submission.title,
    score: submission.score,
    upvote_ratio: submission.upvote_ratio,
    removed_by_category: submission.removed_by_category
  };
  const filter = { id: submissionObj.id };
  const updateDocument = { $set: submissionObj };
  const options = { upsert: true }; // create new document if does not exist
  dbConnect
    .collection(config.submissionsCollection)
    .updateOne(filter, updateDocument, options)
    .then((result) => {
      // console.log(`Updated submission ${submissionObj.id}:`, result);
    })
    .catch((err) => console.log('Error inserting submission into database:', err));
}

function updateOldSubmissionInDb(snoowrapSubmission, dbSubmission) {
  const newUpdateTime = new Date();
  if (hasProp(dbSubmission, 'lastUpdateTime')) {
    const oldUpdateTime = new Date(dbSubmission.lastUpdateTime);
    const msSinceUpdate = newUpdateTime - oldUpdateTime;
    const minsSinceUpdate = (msSinceUpdate / 1000) / 60;
    if (minsSinceUpdate > config.minutesUntilUpdate) {
      console.log(`Updating ${minsSinceUpdate} minutes old submission ${snoowrapSubmission.id}`);
      return updateSubmissionMedia(snoowrapSubmission).then((mediaSubmission) => {
        mediaSubmission.lastUpdateTime = newUpdateTime;
        updateSubmissionInDb(mediaSubmission);
        return mediaSubmission;
      });
    }
  } else {
    dbSubmission.lastUpdateTime = newUpdateTime;
  }
  dbSubmission.score = snoowrapSubmission.score;
  dbSubmission.upvote_ratio = snoowrapSubmission.upvote_ratio;
  dbSubmission.removed_by_category = snoowrapSubmission.removed_by_category;
  updateSubmissionInDb(dbSubmission);
  return new Promise((resolve, reject) => {
    resolve(dbSubmission);
  });
}

router.get(
  '/subreddit/:subredditName/:sortType/:sortTime/:numSubmissions',
  (req, res) => {
    const { sortType, sortTime } = req.params;
    const numSubmissions = parseInt(req.params.numSubmissions, 10);
    const subreddit = reddit.getSubreddit(req.params.subredditName);

    let sortFunction = null;
    switch (sortType) {
      case 'hot':
        sortFunction = subreddit.getHot.bind(subreddit);
        break;
      case 'new':
        sortFunction = subreddit.getNew.bind(subreddit);
        break;
      case 'top':
        sortFunction = subreddit.getTop.bind(subreddit);
        break;
      case 'rising':
        sortFunction = subreddit.getRising.bind(subreddit);
        break;
      case 'controversial':
        sortFunction = subreddit.getControversial.bind(subreddit);
        break;
      default:
        throw new Error(`Invalid sort type: ${sortType}`);
    }

    if (!['hour', 'day', 'week', 'month', 'year', 'all'].includes(sortTime)) {
      throw new Error(`Invalid sort time: ${sortTime}`);
    }

    const dbConnect = db.getDb();
    const submissionsCollection = dbConnect.collection(config.submissionsCollection);
    sortFunction({ time: sortTime, limit: numSubmissions }).then((data) => {
      Promise.all(
        data.map((submission) => {
          if (submission.is_self) {
            return submission;
          }
          const query = { id: submission.id };
          const cursor = submissionsCollection
            .find(query);
          return cursor.count()
            .then((count) => {
              // console.log(`Found ${count} existing submissions for ${submission.id}: ${submission.title}`);
              if (count === 0) {
                const submissionPromise = updateSubmissionMedia(submission);
                return submissionPromise.then((mediaSubmission) => {
                  mediaSubmission.lastUpdateTime = new Date();
                  updateSubmissionInDb(mediaSubmission);
                  return mediaSubmission;
                });
              } if (count === 1) {
                return cursor.next().then((dbSubmission) => updateOldSubmissionInDb(submission, dbSubmission));
              }
              cursor.toArray().then((submissions) => {
                console.log('Duplicate submissions:', submissions);
              });
              throw new Error(`Found ${count} submissions with same id ${submission.id}`);
            })
            .catch((err) => {
              console.log(`Error finding submission ${submission.id}:`, err);
            });
        }),
      ).then((modifiedData) => {
        res.send(modifiedData);
      });
    });
  },
);

module.exports = router;
