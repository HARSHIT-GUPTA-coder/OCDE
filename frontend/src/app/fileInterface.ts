
import { StringifyOptions } from 'querystring';

export interface fileInterface {
	name?: string,
    size?: string,
    id?: number,
    is_file?: boolean,
    path?: string
}
export interface statementInterface {
  id: number,
	name: string,
  tlimit: number,
  mlimit: number
}
export interface submissionInterface {
  Passed: string,
	Status: string,
  Time: string
}
export interface scoreInterface {
  Score: number,
  Name: string
}

export interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
