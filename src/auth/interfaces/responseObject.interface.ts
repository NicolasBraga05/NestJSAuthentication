export default interface IResponseHttpApi<Types> {
	status: number;
	message?: {
		errors?: string[];
		success?: string;
	};
	data?: Types;
	hash?: any;
}
