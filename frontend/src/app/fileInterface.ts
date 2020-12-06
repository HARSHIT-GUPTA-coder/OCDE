import { StringifyOptions } from 'querystring';

export interface fileInterface {
	name: string,
    size: string,
    id: number,
    is_file: boolean
}
export interface statementInterface {
  id: number,
	name: string,
  tlimit: number,
  mlimit: number
}

export interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
