import { useRef, useState, useCallback, useEffect } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { confetti } from 'dom-confetti'
import Xarrow from "react-xarrows"

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
      field_effect: {},
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

  var onConnecting = false
  useEffect(() => {
    if (!query || !query.id) { return }

    if (!query.room_id || !query.id) { return }

    if (onConnecting) { return }
    onConnecting = true

    if (typeof window !== "undefined") {
      confettiButton = document.querySelector(".confetti-button")
      confettiButton.addEventListener("click", () => confetti(confettiButton, {
        angle: "60",
        spread: "100",
        startVelocity: "50",
        elementCount: "50",
        dragFriction: "0.09",
        duration: "4000",
        stagger: "3",
        width: "12px",
        height: "12px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
      }))
    }

    var socketUrl = `ws://localhost:6001/uler_tangga/start?id=${query.id}&room_id=${query.room_id}`
    var socketUrl = `wss://uler-tangga-api.herokuapp.com/uler_tangga/start?id=${query.id}&room_id=${query.room_id}`
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

    onConnecting = false
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

    } else if (response.response_kind === "player_end_turn") {
      handleKindPlayerEndTurn(response.data)

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

    setBoard({...baseBoard, active_player: data.player})
  }

  function handleKindPlayerEndTurn(data) {
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
    var wsPayload = {
      "action": "player_end_turn",
      "payload": {}
    }
    ws.current.send(JSON.stringify(wsPayload))
  }

  // ===================================================================================== HANDLE SENDING START

  // ===================================================================================== HANDLE UTILS FUNC START

  function avatarModal(selectedPlayer) {
    console.log(selectedPlayer.id)
  }

  function fieldModal(selectedPlayer) {
    console.log(selectedPlayer.id)
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

  const LineToNoSSR = dynamic(
    () => import("react-lineto"),
    { ssr: false }
  )

  // ===================================================================================== HANDLE UTILS FUNC END

  return (
    <div className="bg-gradient-to-t from-[#385E72] to-blue-200 h-screen pt-4">
      <div className="container p-1 mx-auto max-w-[1024px]">
        {Object.values(board.player_room_index_map).map((onePlayer, idx) => (
          <span className="mr-4" key={idx}>
            <i className={`${onePlayer.avatar["icon"]}`}></i>
          </span>
        ))}
      </div>

      <div className="container mx-auto max-w-[1024px]">
        <div className="mx-1 rounded bg-[url('/images/map_1.png')] ">
          <div className="grid grid-cols-10 z-10 gap-0 rounded">
            {board.map_config.numbering.map((number, index) => (
              <div className={`w-full ${fieldHeight} bg-[#EEF4ED] bg-opacity-60 border p-[0px] rounded`} key={index}>
                <span className="text-[10px] leading-none ml-[4px]">{number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className={`absolute w-full z-1 top-11 p-1 ${board.player_count >= 1 ? "block" : "hidden"}`}>
          <div className="container mx-auto max-w-[1024px]">
            <div className="mx-1">
              <div className="grid grid-cols-10 gap-0 rounded" ref={parent_1}>
                {board.player_room_index_map["1"] && board.player_room_index_map["1"].map_position.map((field) => (
                  <div className={`w-full ${fieldHeight} p-[0px] rounded`} key={field.index}>
                    <div className={`ml-1 mt-7`} >
                      { field?.is_here && <i
                        className={classGenAvatar(board.player_room_index_map["1"])}
                        onClick={()=>avatarModal(board.player_room_index_map["1"])}
                      ></i> }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-11 p-1 ${board.player_count >= 2 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="mx-1">
              <div className="grid grid-cols-10 gap-0 rounded" ref={parent_2}>
                {board.player_room_index_map["2"] && board.player_room_index_map["2"].map_position.map((field) => (
                  <div className={`w-full ${fieldHeight} p-[0px] rounded`} key={field.index}>
                    <div className={`ml-1 mt-7`} >
                      { field?.is_here && <i
                        className={classGenAvatar(board.player_room_index_map["2"])}
                        onClick={()=>avatarModal(board.player_room_index_map["2"])}
                      ></i> }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-11 p-1 ${board.player_count >= 3 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="mx-1">
              <div className="grid grid-cols-10 gap-0 rounded" ref={parent_3}>
                {board.player_room_index_map["3"] && board.player_room_index_map["3"].map_position.map((field) => (
                  <div className={`w-full ${fieldHeight} p-[0px] rounded`} key={field.index}>
                    <div className={`ml-1 mt-7`} >
                      { field?.is_here && <i
                        className={classGenAvatar(board.player_room_index_map["3"])}
                        onClick={()=>avatarModal(board.player_room_index_map["3"])}
                      ></i> }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute w-full z-1 top-11 p-1 ${board.player_count >= 4 ? "block" : "hidden"}`}>
          <div className="container mx-auto">
            <div className="mx-1">
              <div className="grid grid-cols-10 gap-0 rounded" ref={parent_4}>
                {board.player_room_index_map["4"] && board.player_room_index_map["4"].map_position.map((field) => (
                  <div className={`w-full ${fieldHeight} p-[0px] rounded`} key={field.index}>
                    <div className={`ml-1 mt-7`} >
                      { field?.is_here && <i
                        className={classGenAvatar(board.player_room_index_map["4"])}
                        onClick={()=>avatarModal(board.player_room_index_map["4"])}
                      ></i> }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <span className="confetti-button"></span>
        </div>
      </div>

      <div className="absolute w-full z-1 top-11 p-1 ">
        <div className="container mx-auto max-w-[1024px]">
          <div className="mx-1 rounded">
            <div className="grid grid-cols-10 z-10 gap-0 rounded">
              {board.map_config.numbering.map((number, index) => (
                <div className={`w-full ${fieldHeight} hover:bg-white p-[0px] hover:bg-opacity-50 rounded target-line-${number}`} id={`target-line-${number}`} key={index}>
                </div>
              ))}
              {Object.values(board.map_config.field_effect).map((effect, idx) => (
                effect.benefit_type === "player_move" && <div className="" key={idx}>
                  {/* <LineToNoSSR className="after:content-['◉'] after:border-black" to={`target-line-${effect.effect_player_move.from_coordinate}`} from={`target-line-${effect.effect_player_move.to_coordinate}`} borderColor={effect.effect_player_move.direction === "up" ? "#7FB77E" : "#C21010"} borderStyle={effect.effect_player_move.direction === "up" ? "solid" : "dashed"} borderWidth={2} /> */}
                  <Xarrow
                    start={`target-line-${effect.effect_player_move.from_coordinate}`}
                    end={`target-line-${effect.effect_player_move.to_coordinate}`}
                    color={effect.effect_player_move.direction === "up" ? "#7FB77E" : "#C21010"}
                    dashness={effect.effect_player_move.direction === "up" ? false : true}
                    strokeWidth={3}
                    startAnchor={"middle"}
                    endAnchor={"middle"}
                  />
                  {/* <LineToNoSSR from={`target-line-18`} to={`target-line-1`} borderColor="#C21010" borderStyle="dashed" borderWidth={2} /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[230px]"></div>

      <div className="z-10 fixed flex inset-x-0 w-full botttom-0">

        <div className="bg-gradient-to-t from-blue-300 to-blue-100 block fixed inset-x-0 bottom-0 z-10 border rounded-t-xl h-[185px] p-1 shadow-inner">
          <div className="container mx-auto max-w-[1024px]">
            <div className="fixed bottom-[190px] bg-opacity-90 rounded-lg mt-[-10px] py-1 px-2 bg-gradient-to-t from-blue-300 to-blue-100">
              {board.active_player.identity.name} : {board.active_player.next_state}
            </div>

            <div className="grid grid-cols-10 gap-0 rounded">
              <div className="col-span-3 p-1">
                <div>
                  <label className="block text-gray-700 text-sm font-bold">
                    Nama
                  </label>
                  <small>{board?.player_map[query.id]?.identity?.name}</small>
                </div>
                <hr />
                <div>
                  <label className="block text-gray-700 text-sm font-bold">
                    HP
                  </label>
                  <div className="w-full bg-white rounded-full h-1.5 mb-4 dark:bg-gray-700">
                    <div className="bg-green-600 h-1.5 rounded-full dark:bg-green-500" style={{width: "80%"}}></div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">
                    MP
                  </label>
                  <div className="w-full bg-white rounded-full h-1.5 mb-4 dark:bg-gray-700">
                    <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={{width: "60%"}}></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <i className="fa-solid fa-gun"></i> 20
                  </div>
                  <div>
                  <i className="fa-solid fa-shield-halved"></i> 10
                  </div>
                </div>
              </div>
              <div className="col-span-4 p-1">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Inventory
                </label>

                <div className="overflow-auto h-[127px]">
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Jalan sendiri +10
                  </div>
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Target jalan +10
                  </div>
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Target jalan +10
                  </div>
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Target jalan +10
                  </div>
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Target jalan +10
                  </div>
                  <div className="rounded-lg bg-white py-1 px-2 mb-2">
                    Target jalan +10
                  </div>
                </div>
              </div>
              <div className="col-span-3 p-1">
                <div className="flex-col">
                  <div className="mb-2">
                    <ActionButtonDecider activePlayer={board.active_player}  />
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-center bg-white rounded-xl border shadow-inner shadow-lg">
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
            </div>
          </div>

          <div className="p-2" />
        </div>
      </div>

      <div className="hidden pl-3 pl-5 pl-7 pt-5 pt-7"></div>
    </div>
  )

  function ActionButtonDecider(props) {
    if (props.activePlayer.next_state == "rolling_number") {
      return(
        <button className="btn w-full bg-[#ffafcc] border border-black p-2 rounded-lg shadow-lg" onClick={()=>handleSendRollNumber()}>
          <span className="text-md">Putar Angka</span>
        </button>
      )
    }

    if (props.activePlayer.next_state == "moving") {
      return(
        <button className="btn w-full bg-[#ffafcc] border border-black p-2 rounded-lg shadow-lg" onClick={()=>handleSendMove()}>
          <span className="text-md">Jalan</span>
        </button>
      )
    }

    if (props.activePlayer.next_state == "end_turn") {
      return(
        <button className="btn w-full bg-[#ffafcc] border border-black p-2 rounded-lg shadow-lg" onClick={()=>handleSendFinishTurn()}>
          <span className="text-md">Selesai</span>
        </button>
      )
    }

    return(
      <div></div>
    )
  }
}
