export function convertToTime(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}