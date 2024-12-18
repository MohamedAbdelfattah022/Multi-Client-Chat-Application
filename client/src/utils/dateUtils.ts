export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
}