const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('cache-control', 'no-store, max-age=0')
}

export default auth
