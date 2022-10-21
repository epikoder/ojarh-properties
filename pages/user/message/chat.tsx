import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { ChatHeader, MessageComponent, TypeBox } from "../../../components/ChatComponents"
import Loader from "../../../components/Loader"
import { UserDashboardLayout } from "../../../components/user/UserDashboardLayout"
import { loadUserConversations } from "../../../actions/user/message"
import { RootState, useAppDispatch } from "../../../store"
import { Message, MessageOwner, MessageType } from "../../../Typing.d"
import { useEffect, useRef } from "react"
import { markMessageAsRead } from "actions/message"
import { SocketState, useSocketBloc } from "utils/socket"
import { BlacReact, Cubit } from "blac"
import { Api } from "helpers/api"

class ChatState extends Cubit<{ chat?: MessageOwner, channel?: string }>{
    constructor() {
        super({})
    }
    addMessage = (m: Message) => this.emit({
        ...this.state, chat: { ...this.state.chat, messages: this.state.chat.messages.concat(m) }
    })
    setChatState = (state: { chat: MessageOwner, channel: string }) => this.emit(state)
}
const { useBloc: useChatBloc } = new BlacReact([new ChatState()])

const Page = () => {
    const { data, state } = useSelector((store: RootState) => store.accountSlice.message.conversations)
    const { user } = useSelector((store: RootState) => store.authSlice)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const chatBox = useRef<HTMLDivElement>()
    const [socket, {notify}] = useSocketBloc(SocketState)
    const [{ chat, channel }, { addMessage, setChatState }] = useChatBloc(ChatState)

    useEffect(() => {
        if (!router.isReady) return
        if (state === 'nil') {
            dispatch(loadUserConversations())
            return
        }
        const c = data.find(o => o.id.toString() === router.query.id)
        if (c !== undefined) {
            const channel = 'message-conversation-' + c?.id
            setChatState({ chat: c, channel })
        }
    }, [data, router])

    useEffect(() => {
        socket.on(channel, (m: Message) => {
            addMessage({ ...m, is_read: chatBox.current !== undefined })
            if (chatBox.current) {
                markMessageAsRead({
                    owner: chat?.messages[0].owner_type,
                    id: chat?.id
                })
            }
        })
    }, [channel])

    const send = async (message: string, type: MessageType = 'text'): Promise<boolean> => {
        const receiver = chat.messages[0].sender.id === user.id ? chat.messages[0].receiver : chat.messages[0].sender
        if (type !== 'text') {
            try {
                const payload: Message = {
                    content: message,
                    id: chat.id,
                    type: type,
                }
                await Api().post('/user/messages/create', JSON.stringify(payload))
            } catch (error) {
                return false
            }
            addMessage({
                content: 'storage/chat/' + message,
                created_at: new Date(),
                type: type,
                owner_id: chat.id,
                owner_type: "conversations",
                sender: user,
                receiver,
            })
            notify({
                message: 'You got a new dispute',
                type: 'dispute'
            })
            return true
        }
        const payload: Message = {
            content: message,
            id: chat.id,
            type: type,
            sender: user,
            receiver,
            owner_type: "conversations",
        }
        socket.emit(channel, payload)
        return true
    }

    useEffect(() => {
        if (chatBox.current == undefined) return
        chatBox.current.scrollTop = chatBox.current.scrollHeight
    }, [chat])

    useEffect(() => {
        markMessageAsRead({
            owner: chat?.messages[0].owner_type,
            id: chat?.id
        })
    }, [chat])

    return <UserDashboardLayout className="md:p-1">
        {() => <>
            {chat !== undefined && <div>
                <ChatHeader title={chat.title} message={chat.messages[0]} />
                <div className="flex flex-col justify-between bg-main" style={{
                    height: `calc(100vh - 200px)`
                }}>
                    <div className="overflow-y-scroll" ref={chatBox}>
                        {chat.messages.map((m, i) =>
                            <div key={i}>
                                <MessageComponent message={m} />
                            </div>
                        )}
                    </div>
                    <div className="relative lg:flex justify-center my-1">
                        <div className="bottom-0 md:bottom-14 lg:max-w-[50vw] w-full px-2" style={{ zIndex: 100 }}>
                            <TypeBox onSend={send} />
                        </div>
                    </div>
                </div>
            </div>}
            {(state === 'success' || state === 'failed') && chat === undefined &&
                <div className="p-12 flex flex-col justify-center items-center">
                    CHAT NOT FOUND
                </div>}
            {state === 'pending' && <Loader />}
        </>}
    </UserDashboardLayout>
}

export default Page