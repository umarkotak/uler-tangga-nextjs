import { useRef, useState, useCallback, useEffect } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { confetti } from 'dom-confetti';

export default function Home() {
  let router = useRouter()
  const query = router.query
  const ws = useRef(null)

  const [parent_1] = useAutoAnimate({duration: 500})
  const [parent_2] = useAutoAnimate({duration: 500})
  const [parent_3] = useAutoAnimate({duration: 500})
  const [parent_4] = useAutoAnimate({duration: 500})
  const [parent_5] = useAutoAnimate({duration: 500})
  const [parent_6] = useAutoAnimate({duration: 500})
  const [parent_7] = useAutoAnimate({duration: 500})
  const [parent_8] = useAutoAnimate({duration: 500})
  const [parent_9] = useAutoAnimate({duration: 500})
  const [parent_10] = useAutoAnimate({duration: 500})

  const fieldHeight = "h-[75px]"
  var baseBoard = {
    id: "",
    map_config: {
      min_number: 0,
      max_number: 0,
      size: 0,
      numbering: [],
      direction: [],
    },
    player_count: 0,
    player_map: {},
    player_room_index_map: {},
    active_player: {
      identity: {}
    }
  }
  const [board, setBoard] = useState(baseBoard)
  const [activeNumber, setActiveNumber] = useState(1)
  const [isWinner, setIsWinner] = useState(false)

  var confettiButton
  if (typeof window !== "undefined") {
    confettiButton = document.querySelector(".confetti-button")
    confettiButton.addEventListener("click", () => confetti(confettiButton, {
      angle: "75",
      spread: "200",
      startVelocity: "50",
      elementCount: "40",
      dragFriction: "0.09",
      duration: "4000",
      stagger: "3",
      width: "10px",
      height: "10px",
      perspective: "500px",
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    }))
  }

  useEffect(() => {
    if (!query || !query.id) { return }

    var socketUrl = `ws://localhost:6001/uler_tangga/start?id=${query.id}&room_id=${query.room_id}`
    socketUrl = `wss://uler-tangga-api.herokuapp.com/uler_tangga/start?id=${query.id}&room_id=${query.room_id}`
    ws.current = new WebSocket(socketUrl)
    ws.current.onopen = () => {
      console.log("CONNECTION OPEN")
      joinGameRoom()
    }
    ws.current.onclose = () => {
      console.log("CONNECTION CLOSE")
    }
    return () => {
      ws.current.close()
    }
  // eslint-disable-next-line
  }, [query])

  useEffect(() => {
    if (!ws.current) { return }
    ws.current.onmessage = (e) => {
      e.preventDefault()
      try {
        handleIncomingMessage(JSON.parse(e.data))
      } catch (e) {
        console.error("ERROR DATA", e.data)
      }
    }
  // eslint-disable-next-line
  }, [query])

  function joinGameRoom() {
    var wsPayload = {
      "action": "player_join_room",
      "payload": {}
    }
    ws.current.send(JSON.stringify(wsPayload))
  }

  // ===================================================================================== HANDLE INCOMING START

  function handleIncomingMessage(response) {
    console.warn("RESPONSE OBJECT", response)

    if (response.response_kind === "player_join_room") {
      handleKindJoinRoom(response.data)

    } else if (response.response_kind === "player_leave_room") {
      handleKindLeaveRoom(response.data)

    } else if (response.response_kind === "player_move") {
      handleKindMovePlayer(response.data)

    } else if (response.response_kind === "player_roll_number") {
      handleKindRollNumber(response.data)

    } else {
      console.error("INVALID RESPONSE KIND", response)
    }
  }

  function handleKindJoinRoom(data) {
    baseBoard = data
    setBoard(baseBoard)
  }

  function handleKindLeaveRoom(data) {
    baseBoard = data
    setBoard(baseBoard)
  }

  function handleKindMovePlayer(data) {
    var playerIndex = data.player.identity.room_player_index_string
    var moveCount = data.number
    var tempBoard = {...baseBoard}

    var selectedPion = tempBoard.player_room_index_map[playerIndex]

    var prevIndex = parseInt(selectedPion.index_position)
    var nextIndex = prevIndex + moveCount

    var fromPos = tempBoard.map_config.direction[prevIndex]
    var targetPos = tempBoard.map_config.direction[nextIndex]

    swapArrayElements(tempBoard.player_room_index_map[playerIndex].map_position, fromPos, targetPos)

    tempBoard.player_room_index_map[playerIndex].index_position += moveCount

    setBoard({...baseBoard, player_room_index_map: tempBoard.player_room_index_map})

    if (tempBoard.player_room_index_map[playerIndex].index_position >= (tempBoard.map_config.size - 1)) {
      setIsWinner(true)
      confettiButton.click()
    }

    setBoard({...baseBoard, active_player: data.next_player})
  }

  function handleKindRollNumber(data) {
    setActiveNumber(data.number)
    setBoard({...baseBoard, active_player: data.player})
  }

  // ===================================================================================== HANDLE INCOMING END

  // ===================================================================================== HANDLE SENDING START

  function handleSendRollNumber() {
    var wsPayload = {
      "action": "player_roll_number",
      "payload": {}
    }
    ws.current.send(JSON.stringify(wsPayload))
  }

  function handleSendMove() {
    var wsPayload = {
      "action": "player_move",
      "payload": {}
    }
    ws.current.send(JSON.stringify(wsPayload))
  }

  function handleSendFinishTurn() {

  }

  // ===================================================================================== HANDLE SENDING START

  // ===================================================================================== HANDLE UTILS FUNC START

  function swapArrayElements(arr, indexA, indexB) {
    var temp = arr[indexA]
    arr[indexA] = arr[indexB]
    arr[indexB] = temp
  }

  function classGenAvatarPosition(player) {
    return `
      relative
      ${player.avatar_position["margin_left"]}
      ${player.avatar_position["margin_top"]}
    `
  }

  function classGenAvatar(player) {
    return `
      ${player.avatar["icon"]}
      ${player.avatar["base_color"]}
      ${player.is_online ? "" : "opacity-40"}
    `
  }

  const AnimatedNumbersNoSSR = dynamic(
    () => import("react-animated-numbers"),
    { ssr: false }
  )

  // ===================================================================================== HANDLE UTILS FUNC END

  return (
    <div>
      <div className="container mx-auto">
        <div>
          <div className="grid grid-cols-10 gap-0">
            {board.map_config.numbering.map((number, index) => (
              <div className={`w-full ${fieldHeight} bg-[#EEF4ED] border p-[0px]`} key={index}>
                <small className="leading-none ml-[5px]">{number}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className={`absolute w-full z-1 top-0 ${board.player_count >= 1 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-10 gap-0" ref={parent_1}>
              {board.player_room_index_map["1"] && board.player_room_index_map["1"].map_position.map((field) => (
                <div className={`w-full ${fieldHeight} p-[0px]`} key={field.index}>
                  <div className={classGenAvatarPosition(board.player_room_index_map["1"])}>
                    { field?.is_here && <i className={classGenAvatar(board.player_room_index_map["1"])}></i> }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-0 ${board.player_count >= 2 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-10 gap-0" ref={parent_2}>
              {board.player_room_index_map["2"] && board.player_room_index_map["2"]["map_position"].map((field) => (
                <div className={`w-full ${fieldHeight} p-[0px]`} key={field.index}>
                  <div className={classGenAvatarPosition(board.player_room_index_map["2"])}>
                    { field.is_here && <i className={classGenAvatar(board.player_room_index_map["2"])}></i> }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-0 ${board.player_count >= 3 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-10 gap-0" ref={parent_3}>
              {board.player_room_index_map["3"] && board.player_room_index_map["3"]["map_position"].map((field) => (
                <div className={`w-full ${fieldHeight} p-[0px]`} key={field.index}>
                  <div className={classGenAvatarPosition(board.player_room_index_map["3"])}>
                    { field.is_here && <i className={classGenAvatar(board.player_room_index_map["3"])}></i> }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-0 ${board.player_count >= 4 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-10 gap-0" ref={parent_4}>
              {board.player_room_index_map["4"] && board.player_room_index_map["4"]["map_position"].map((field) => (
                <div className={`w-full ${fieldHeight} p-[0px]`} key={field.index}>
                  <div className={classGenAvatarPosition(board.player_room_index_map["4"])}>
                    { field.is_here && <i className={classGenAvatar(board.player_room_index_map["4"])}></i> }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-0 ${board.player_count >= 5 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="grid grid-cols-10 gap-0" ref={parent_5}>
              {board.player_room_index_map["5"] && board.player_room_index_map["5"]["map_position"].map((field) => (
                <div className={`w-full ${fieldHeight} p-[0px]`} key={field.index}>
                  <div className={classGenAvatarPosition(board.player_room_index_map["5"])}>
                    { field.is_here && <i className={classGenAvatar(board.player_room_index_map["5"])}></i> }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto">
          <span className="confetti-button"></span>
          <div className="flex justify-between">
            <div className="p-2">
              <button className="btn border p-2 rounded mr-1" onClick={()=>handleSendRollNumber()}>PUTAR ANGKA</button>
              <button className="btn border p-2 rounded" onClick={()=>handleSendMove()}>JALAN</button>
            </div>
            <div className="p-2">
              <span>Lagi jalan: {board.active_player.identity.name}</span>
              <br />
              <span>Fase: {board.active_player.next_state}</span>
            </div>
          </div>
          {/* <button className="btn border p-2 rounded" onClick={()=>handleSendFinishTurn()}>SELESAI</button> */}
          <div className="p-2">
            <div className="border rounded p-2">
              <AnimatedNumbersNoSSR
                animateToNumber={activeNumber}
                fontStyle={{fontSize: 40}}
                configs={[
                  { mass: 1, tension: 220, friction: 100 },
                ]}
              ></AnimatedNumbersNoSSR>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden pl-3 pl-5 pl-7 pt-5 pt-7"></div>
    </div>
  )
}
