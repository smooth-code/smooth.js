export const process = ({ api, logger }) => async ({ type, data }) => {
  try {
    const result = await logger(
      api
        .truncate({ type })
        .then(() => api.createMany({ type, data: data.map(d => d.data) })),
      `Generate ${type}`,
    )
    return result
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(JSON.stringify(error.response.data))
    }
    throw error
  }
}
