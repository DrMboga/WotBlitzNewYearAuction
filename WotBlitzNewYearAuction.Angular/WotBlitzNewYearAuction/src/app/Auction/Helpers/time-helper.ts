export const getUtcNow = (): Date => {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  );
};

export const nextPriceDropAsString = (dateUntil: Date): string => {
  const utcNow = getUtcNow();
  const dateUntilAsDate = new Date(dateUntil);
  const timeDiffInSec = Math.round(Math.abs(utcNow.getTime() - dateUntilAsDate.getTime()) / 1000);
  const dayInSec = 60 * 60 * 24;
  if (timeDiffInSec > dayInSec) {
    return '∞';
  }

  const hours = Math.floor(timeDiffInSec / (60 * 60));
  const minutes = Math.floor((timeDiffInSec - hours * 60 * 60) / 60);
  const seconds = Math.round(timeDiffInSec - hours * 60 * 60 - minutes * 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
