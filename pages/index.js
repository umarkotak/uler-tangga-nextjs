import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const [userId, setUserId] = useState("")

  return (
    <div className="bg-[#385E72] h-screen pt-4 pb-2 px-2">
      <div
        className="mx-auto max-w-[980px] bg-[url('/images/bg.jpeg')] bg-cover bg-center backdrop-blur-sm p-4 rounded-xl shadow-xl shadow-cyan-500 h-full"
        style={{
          "mask-image": `radial-gradient(
            white 0%,
            white 30%,
            transparent 80%,
            transparent
          )`
        }}
      >
        <div className="container mt-16 mx-auto p-4 rounded-xl text-center">
          <span className="text-5xl font-bold font-sans drop-shadow-lg rounded-xl p-2 subpixel-antialiased text-[#071330]">ULAR TANGGA ONLINE</span>
        </div>

        <div className="container mt-4 mx-auto backdrop-blur-sm max-w-[450px] bg-white bg-opacity-50 p-4 drop-shadow-lg rounded-xl text-center">
          <div className="mb-4 text-left">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
              Room ID
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  placeholder="jhon-room" value={roomId} onChange={(e) => {setRoomId(e.target.value)}} />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
              Username
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  placeholder="jhonedoe" value={userId} onChange={(e) => {setUserId(e.target.value)}} />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Map
            </label>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="default" selected>Default</option>
            </select>
          </div>

          <div className="mb-4 text-left text-sm">
            <span>
              *notes: room id and username only contain alphanumeric, dash, and underscore.
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Link href={`/play_room?id=${userId}&room_id=${roomId}`}>
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Join Game</a>
            </Link>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Need help?
            </a>
          </div>

          <div className="mt-8 text-sm">
            <span>
              ular tangga online 2022
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
