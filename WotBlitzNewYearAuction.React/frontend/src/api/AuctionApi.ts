import { AuctionResponse } from '../Model/AuctionResponse';

const baseUrl = 'http://localhost:6001';
const url = `${baseUrl}/auction`;

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'You do not have permission to view the project(s).';
    default:
      return 'There was an error retrieving the project(s). Please try again.';
  }
}

function checkStatus(response: Response) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response): Promise<AuctionResponse> {
  return response.json();
}

const auctionAPI = {
  async get(): Promise<AuctionResponse> {
    try {
      const response = await fetch(url);
      const responseWithStatus = checkStatus(response);
      return await parseJSON(responseWithStatus);
    } catch (error) {
      console.log('log client error ', error);
      throw new Error('There was an error retrieving the projects. Please try again.');
    }
  },
};

export { auctionAPI };
