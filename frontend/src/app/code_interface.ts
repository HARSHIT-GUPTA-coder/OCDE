export interface code_interface {
	input_type: string,
	input: string,
  lang: string,
  command: string,
  file_id: string
}

export interface output_interface {
	success: boolean,
	output: string
}
