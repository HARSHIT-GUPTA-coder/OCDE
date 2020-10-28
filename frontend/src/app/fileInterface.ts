import { StringifyOptions } from 'querystring';

export interface fileInterface {
	type: string,
	name: string,
    size: string,
    id: number,
    items?: number,
}

export interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}