import defaultPhoto from '../../../img/default.jpeg';
const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const photoSrc = (item) => {
  const key = item?.img;
  if (!key) return defaultPhoto;
  const val = String(key);
  if (/^https?:\/\//i.test(val)) return val;
  const base = String(bucket_url || '').replace(/\/+$/, '');
  if (val.includes('/')) return `${base}/${val.replace(/^\/+/, '')}`;
  return `${base}/images/imageStaff/${val}`;
};

export default photoSrc;