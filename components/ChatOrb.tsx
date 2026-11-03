export function ChatOrb() {
  return (
    <span className="chat-orb" aria-hidden="true">
      <span className="chat-orb-glow" />
      <span className="chat-orb-dots">
        {Array.from({ length: 25 }, (_, index) => <i key={index} />)}
      </span>
    </span>
  );
}
