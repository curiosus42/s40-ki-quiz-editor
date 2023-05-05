export default function InputTextArea({ placeholder, className, onChange }) {
  return (
    <textarea
      className={
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-ellipsis flex-grow-0 flex-shrink min-h-0 resize-none overflow-hidden " +
        className
      }
      rows={1}
      placeholder={placeholder}
      onChange={(ev) => {
        onChange && onChange(ev);
        ev.currentTarget.style.height = "auto"; // important for correct resize behaviour
        ev.currentTarget.style.height = ev.currentTarget.scrollHeight + "px";
      }}
    />
  );
}
