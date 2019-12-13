import { IGithubUploader } from './github-uploader.interface';

export interface IGithubAsset {
  url: string;
  browser_download_url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  state: string;
  content_type: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  uploader: IGithubUploader;
}
