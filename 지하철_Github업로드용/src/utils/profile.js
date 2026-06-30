export const ADJECTIVES = ['바쁜', '길잃은', '지각위기', '퇴근하고픈', '배고픈', '음악듣는', '졸고있는', '달리는', '행복한', '심심한'];
export const NOUNS = ['1호선 탑승객', '환승러', '프로출근러', '지하철탐험가', '뚜벅이', '여행자', '힙스터', '미식가', '방랑자', '보부상'];
export const COLORS = ['#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#fab005', '#fd7e14'];

export function getUserProfile() {
  let profile = localStorage.getItem('my_profile');
  if (!profile) {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    profile = JSON.stringify({ name: `${adj} ${noun}`, color });
    localStorage.setItem('my_profile', profile);
  }
  return JSON.parse(profile);
}

export function setUserProfileName(newName) {
  let profile = getUserProfile();
  profile.name = newName;
  localStorage.setItem('my_profile', JSON.stringify(profile));
  return profile;
}
