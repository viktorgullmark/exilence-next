import { IGithubAsset } from './github-asset.interface';
import { IGithubAuthor } from './github-author.interface';

export interface IGithubRelease {
  url: string;
  html_url: string;
  assets_url: string;
  upload_url: string;
  tarball_url: string;
  zipball_url: string;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  author: IGithubAuthor;
  assets: IGithubAsset[];
  notified?: boolean;
}
