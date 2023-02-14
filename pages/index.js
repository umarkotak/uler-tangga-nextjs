import { useState, useEffect } from 'react'
import Link from 'next/link'

import ulerTanggaApi from "../apis/UlerTanggaApi"

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const [userId, setUserId] = useState("")

  const [roomList, setRoomList] = useState([])

  useEffect(() => {
    GetRoomList()
  // eslint-disable-next-line
  }, [])

  async function GetRoomList() {
    try {
      const response = await ulerTanggaApi.GetRoomList({})
      const body = await response.json()
      if (response.status !== 200) {
        console.log(body.error_message)
        return
      }
      setRoomList(body.data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="bg-[#385E72] min-h-screen pt-4 pb-2 px-2">
      <div className="mx-auto max-w-[980px] bg-clip-border bg-[url('/images/bg.jpeg')] bg-cover bg-center backdrop-blur-sm p-4 rounded-xl shadow-xl shadow-cyan-500 min-h-screen">
        <div className="container mt-8 mx-auto p-4 rounded-xl text-center">
          <span className="text-5xl font-bold font-sans drop-shadow-lg rounded-xl p-2 subpixel-antialiased text-[#071330]">ULAR TANGGA ONLINE</span>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2">
          <div className="p-1">
            <div className="mt-4 backdrop-blur-sm bg-white bg-opacity-50 p-4 drop-shadow-lg rounded-xl text-center h-[480px]">
              <div className="mb-4 text-left">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username *
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  placeholder="jhonedoe" value={userId} onChange={(e) => {setUserId(e.target.value)}} />
                <small>this is a MUST, if you forget to set the username it will break the server</small>
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Room ID *
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  placeholder="jhon-room" value={roomId} onChange={(e) => {setRoomId(e.target.value)}} />
                <small>you can input room manually or click copy from room list to join</small>
              </div>
              <div className="mb-4 text-left">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Map
                </label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue="default">
                  <option value="default">Default</option>
                </select>
              </div>

              <div className="mb-4 text-left text-sm">
                <span>
                  *notes: room id and username only contain alphanumeric, dash, and underscore.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Need help?
                </a>
                <a
                  href={(roomId && userId) ? `/play_room?id=${userId}&room_id=${roomId}` : "#"}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Join Games
                </a>
              </div>

              <div className="mt-8 text-sm">
                <span>
                  ular tangga online 2022
                </span>
              </div>
            </div>
          </div>

          <div className="p-1">
            <div className="mt-4 backdrop-blur-sm w-full bg-white bg-opacity-50 p-4 drop-shadow-lg rounded-xl text-center h-[480px]">
              <div className="mb-4 text-left text-lg">
                <b>Room List</b>
              </div>
              <div className="mb-4 text-left text-sm">
                <span>if your room does not exists, it will be automatically created during join</span>
              </div>

              <div className='overflow-auto h-[315px]'>
                {roomList.map((room, idx) => (
                  <div className="mb-4 text-left text-sm border border-black p-2 rounded-lg flex items-center justify-between" key="idx">
                    <span>Room ID: <b>{room.id}</b></span>
                    <span>Map: <b>{room.map_config.title}</b></span>
                    <span><i className="fa fa-user"></i> {room.player_count}/{room.map_config.max_player}</span>
                    <button className="border border-black rounded-lg p-2 hover:bg-white" onClick={()=>setRoomId(room.id)}>Copy</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
