import type { Message } from '../../types/chat'

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-3xl border px-4 py-3 sm:max-w-[78%] sm:px-5 sm:py-4 ${
        isUser ? 'border-white/10 bg-black text-white' : 'border-white/8 bg-white/3 text-zinc-100'
      }`}>
        <p className="whitespace-pre-wrap text-[15px] leading-7">{message.text}</p>
      </div>
    </div>
  )
}
