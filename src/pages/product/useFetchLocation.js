import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { URL_API } from '../../constants/config'

export default function useFetchLocation() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchLocation = async () => {
    setLoading(true)
    const res = await axios({
      url: `${URL_API}/location`,
      method: 'GET'
    })
    setData(res?.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  return {
    data,
    loading
  }
}
