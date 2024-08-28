export function convertToTime(decimalNumber) {
  // Extract the hours
  let hours = Math.floor(decimalNumber / 60);
  // Extract the minutes
  let totalMinutes = Math.floor(decimalNumber % 60);
  // Convert the fractional part to seconds
  const fractionalPart = decimalNumber - Math.floor(decimalNumber);
  let seconds = Math.round(fractionalPart * 60);

  // Handle the case where seconds could be 60
  if (seconds === 60) {
    seconds = 0;
    totalMinutes += 1;
  }

  // Handle the case where minutes could be 60
  let minutes = totalMinutes;
  if (minutes === 60) {
    minutes = 0;
    hours += 1;
  }

  // Ensure minutes and seconds are displayed as two digits
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Return formatted time
  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}
