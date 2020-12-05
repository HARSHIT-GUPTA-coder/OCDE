import { StringifyOptions } from 'querystring';

export interface fileInterface {
	name: string,
    size: string,
    id: number,
    is_file: boolean
}

export interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}