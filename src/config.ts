export const getServerUrl = () => process.env.GATSBY_API_SERVER_URL as string
export const getServerApiUrl = () => getServerUrl() + `/api/v1`
