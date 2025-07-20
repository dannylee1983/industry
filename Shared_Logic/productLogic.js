// Force update commit to refresh jsDelivr cache

export const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQOkoLqcOywo_NTtJ4klohydC310Ak6tzu3twz_hP7i2QzQZaMGJgLPOS7nqrIrQm2SFQIHBOv0OiSK/pub?gid=0&single=true&output=csv';

export async function loadProducts() {
  const res = await fetch(sheetUrl);
  const text = await res.text();
  const rows = text.trim().split('\n').slice(1);
  return rows.map(r => {
    const [id, artist, track, version, artwork, youtube, audio, price, link, releaseDate, genre, bpm] = r.split(',');
    return { id, artist, track, version, artwork, youtube, audio, price, link, releaseDate, genre, bpm };
  });
}

export function genreClass(genre) {
  switch (genre) {
    case 'Electric Blue': return 'genre-electric-blue';
    case 'Electric Pink': return 'genre-electric-pink';
    case 'Tech': return 'genre-tech';
    case 'Hard': return 'genre-hard';
    default: return '';
  }
}

export function isNewRelease(dateStr) {
  if (!dateStr) return false;
  const [day, month, year] = dateStr.split('/');
  const releaseDate = new Date(`20${year}`, month - 1, day);
  const today = new Date();
  releaseDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = (today - releaseDate) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 20;  // max window used in mini app
}

export function isComingSoon(dateStr) {
  if (!dateStr) return false;
  const [day, month, year] = dateStr.split('/');
  const releaseDate = new Date(`20${year}`, month - 1, day);
  const today = new Date();
  releaseDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = (releaseDate - today) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 7;
}

export function isReleased(dateStr) {
  if (!dateStr) return false;
  const [day, month, year] = dateStr.split('/');
  const releaseDate = new Date(`20${year}`, month - 1, day);
  const today = new Date();
  releaseDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return releaseDate <= today;
}

export function play(products, p) {
  products.forEach(prod => {
    const audioElem = document.getElementById(`audio-player-${prod.id}`);
    const ytElem = document.getElementById(`youtube-player-${prod.id}`);
    if (audioElem) {
      audioElem.pause();
      audioElem.style.display = 'none';
      audioElem.src = '';
    }
    if (ytElem) {
      ytElem.style.display = 'none';
      ytElem.src = '';
    }
  });

  const audio = document.getElementById(`audio-player-${p.id}`);
  const yt = document.getElementById(`youtube-player-${p.id}`);

  if (p.youtube) {
    yt.src = `https://www.youtube.com/embed/${p.youtube}?autoplay=1&rel=0`;
    yt.style.display = 'block';
    yt.style.height = '200px';
    yt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (p.audio) {
    audio.src = p.audio;
    audio.style.display = 'block';
    setTimeout(() => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Autoplay failed:', err));
      }
    }, 300);
    audio.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    alert('No preview available.');
  }
}