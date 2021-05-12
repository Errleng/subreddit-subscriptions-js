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

function getSubmissionPreviewImageUrls(submission) {
  const imageUrls = [];

  // sometimes there can be a preview property but preview.enabled is false
  if (Object.prototype.hasOwnProperty.call(submission, 'preview')
    && submission.preview.enabled) {
    // mostly arbitrary, since there's no official documentation on preview image resolutions
    const previewImages = submission.preview.images[0].resolutions;
    const MAX_PREVIEW_RESOLUTION_INDEX = 3;
    imageUrls.push(
      previewImages[
        Math.min(previewImages.length - 1, MAX_PREVIEW_RESOLUTION_INDEX)
      ].url,
    );
  } else if (
    Object.prototype.hasOwnProperty.call(submission, 'is_gallery')
    && submission.is_gallery
  ) {
    if (Object.prototype.hasOwnProperty.call(submission, 'gallery_data')) {
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
  if (!submission.is_self
    && (!Object.prototype.hasOwnProperty.call(submission, 'preview')
      && !((Object.prototype.hasOwnProperty.call(submission, 'is_gallery') && submission.is_gallery)
        && Object.prototype.hasOwnProperty.call(submission, 'gallery_data')))) {
    await submission.fetch().then((updatedSubmission) => {
      console.log(`Fetching data for ambiguous image post: ${submission.title}, ${submission.url}`);
      submission = updatedSubmission;
    });
  }
  return getSubmissionPreviewImageUrls(submission);
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
        modifiedSubmission.image_urls = await getSubmissionPreviewImagesWrapper(
          modifiedSubmission,
        );
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
