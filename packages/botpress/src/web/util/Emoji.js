import ReactEmoji from 'react-emoji'

export default (text, size = 20) => {
  return ReactEmoji.emojify(text, {
    emojiType: 'emojione',
    attributes: { width: size, height: size }
  })
}
