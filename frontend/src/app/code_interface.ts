export interface code_interface {
	type: string,
	code: string,
	input_type: string,
	input: string,
	lang: string,
	args: string
}

export interface output_interface {
	success: boolean,
	output: string
}