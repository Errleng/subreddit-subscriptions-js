const express = require('express');

const router = express.Router();
const reddit = require('./reddit');

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
  return Object.prototype.hasOwnProperty.call(object, propertyName) && (object[propertyName] !== null) && (object[propertyName] !== undefined);
}

function getSubmissionPreviewImageUrls(submission) {
  const imageUrls = [];

  if (hasProp(submission, 'preview')) {
    const preview = submission.preview;
    if (hasProp(preview, 'images')) {
      const images = preview.images;
      // mostly arbitrary, since there's no official documentation on preview image resolutions
      const previewImages = images[0].resolutions;
      const MAX_PREVIEW_RESOLUTION_INDEX = 3;
      imageUrls.push(
        previewImages[
          Math.min(previewImages.length - 1, MAX_PREVIEW_RESOLUTION_INDEX)
        ].url,
      );
    }
  } else if (hasProp(submission, 'is_gallery') && submission.is_gallery) {
    if (hasProp(submission, 'gallery_data')) {
      const galleryImages = submission.gallery_data.items;
      galleryImages.forEach((image) => {
        const metadata = submission.media_metadata[image.media_id];
        const previewImages = metadata.p;

        const MAX_PREVIEW_RESOLUTION_INDEX = 3;
        const imagePreview = previewImages[
          Math.min(previewImages.length - 1, MAX_PREVIEW_RESOLUTION_INDEX)
        ].u;

        imageUrls.push(imagePreview);
      });
    } else {
      throw new Error(
        `Submission has is_gallery (${submission.is_gallery}) but does not have gallery_data (${submission.gallery_data})`
      );
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
  if (!submission.is_self &&
    !(hasProp(submission, 'preview') && hasProp(submission, 'images')) &&
    !((hasProp(submission, 'is_gallery') && submission.is_gallery) &&
      hasProp(submission, 'gallery_data'))) {
    await submission.fetch().then((updatedSubmission) => {
      console.log(`Fetching data for ambiguous image post: ${submission.title}, ${submission.url}`);
      submission = updatedSubmission;
    });
  }
  return getSubmissionPreviewImageUrls(submission);
}

function getMedia(submission) {
  if (hasProp(submission, 'media_embed')) {
    const media_embed = submission.media_embed;
    if (hasProp(media_embed, 'content')) {
      return { type: 'embed', media: media_embed.content };
    }
  }

  if (hasProp(submission, 'media')) {
    const media = submission.media;
    if (hasProp(media, 'oembed')) {
      const oembed = media.oembed;
      if (hasProp(oembed, 'html')) {
        return { type: 'html', media: oembed.html };
      } else if (hasProp(oembed, 'thumbnail_url')) {
        return { type: 'thumbnail', media: oembed.thumbnail_url };
      }
    } else if (hasProp(media, 'reddit_video')) {
      const reddit_video = media.reddit_video;
      if (hasProp(reddit_video, 'fallback_url')) {
        return { type: 'video', media: reddit_video.fallback_url };
      }
    }
  }

  if (hasProp(submission, 'preview')) {
    const preview = submission.preview;
    if (hasProp(preview, 'reddit_video_preview')) {
      const reddit_video_preview = preview.reddit_video_preview;
      if (hasProp(reddit_video_preview, 'fallback_url')) {
        return { type: 'video', media: reddit_video_preview.fallback_url };
      }
    }
  }

  return null;
}

async function getMediaWrapper(submission) {
  if (!submission.is_self &&
    !(hasProp(submission, 'media_embed') && hasProp(submission.media_embed, 'content')) &&
    !(hasProp(submission, 'media') &&
      ((hasProp(submission.media, 'oembed') &&
        (hasProp(submission.media.oembed, 'html') || hasProp(submission.media.oembed, 'thumbnail_url'))) ||
        (hasProp(submission.media, 'reddit_video') && hasProp(submission.media.reddit_video, 'fallback_url'))
      )) &&
    !(hasProp(submission, 'preview') && hasProp(submission.preview, 'reddit_video_preview') && hasProp(submission.preview.reddit_video_preview, 'fallback_url'))) {
    await submission.fetch().then((updatedSubmission) => {
      console.log(`Fetching data for ambiguous media post: ${submission.title}, ${submission.url}`);
      submission = updatedSubmission;
    });
  }
  return getMedia(submission);
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

    sortFunction({ time: sortTime, limit: numSubmissions }).then((data) => {
      Promise.all(data.map(async (submissionData) => {
        const modifiedSubmission = submissionData;

        // checking media for all non-selftext posts is slow
        const mediaObject = await getMediaWrapper(modifiedSubmission);
        if (mediaObject !== null) {
          switch (mediaObject.type) {
            case 'embed':
              modifiedSubmission.html = mediaObject.media;
              break;
            case 'html':
              modifiedSubmission.html = mediaObject.media;
              break;
            case 'thumbnail':
              modifiedSubmission.html = mediaObject.media;
              break;
            case 'video':
              modifiedSubmission.video = mediaObject.media;
              break;
            default:
              throw new Error(`Invalid media type: ${mediaObject}`);
          }
        }

        console.log('HTML:', modifiedSubmission.html);
        console.log('Video:', modifiedSubmission.video);

        if (mediaObject === null) {
          // however, preview media are preferred over preview images so check images after media
          modifiedSubmission.image_urls = await getSubmissionPreviewImagesWrapper(
            modifiedSubmission,
          );
        }
        return modifiedSubmission;
      })).then(
        (modifiedData) => {
          res.send(modifiedData);
        },
      );
    });
  },
);

module.exports = router;
