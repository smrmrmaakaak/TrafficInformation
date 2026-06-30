import { X } from 'lucide-react';

const RECOMMEND_POIS = [
  { id: 1, name: '강남스타일 맛집', category: '맛집', address: '강남구 테헤란로 123', nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '강남', color: '#3bc44a', walkingMinutes: 3 } },
  { id: 2, name: '홍대 감성 카페', category: '카페', address: '마포구 홍익로 45', nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '홍대입구', color: '#3bc44a', walkingMinutes: 5 } },
  { id: 3, name: '성수동 브런치', category: '맛집', address: '성동구 연무장길 7', nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '성수', color: '#3bc44a', walkingMinutes: 4 } },
  { id: 4, name: '이태원 루프탑 펍', category: '술집', address: '용산구 이태원로 200', nearestStation: { lineKey: '6', lineLabel: '6호선', stationName: '이태원', color: '#c55c1d', walkingMinutes: 2 } },
  { id: 5, name: '종로 노포 식당', category: '맛집', address: '종로구 종로 100', nearestStation: { lineKey: '1', lineLabel: '1호선', stationName: '종로3가', color: '#0052a4', walkingMinutes: 1 } },
  { id: 6, name: '여의도 더현대', category: '쇼핑', address: '영등포구 여의대로 108', nearestStation: { lineKey: '5', lineLabel: '5호선', stationName: '여의나루', color: '#996cac', walkingMinutes: 6 } },
  { id: 7, name: '합정 힙한 식당', category: '맛집', address: '마포구 양화로 60', nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '합정', color: '#3bc44a', walkingMinutes: 3 } },
];

export default function RecommendModal({ showModal, setShowModal, submitRecommend }) {
  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }} onClick={() => setShowModal(false)}>
      <div className="glass-card animate-slide-up" style={{
        width: '100%', maxWidth: '400px', padding: '24px',
        backgroundColor: 'var(--bg-secondary)',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>어떤 핫플을 추천할까요?</h3>
          <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {RECOMMEND_POIS.map(poi => (
            <button
              key={poi.id}
              onClick={() => {
                submitRecommend(poi);
                setShowModal(false);
              }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                padding: '16px', borderRadius: '16px',
                backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)',
                textAlign: 'left', cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', backgroundColor: poi.nearestStation.color, padding: '2px 8px', borderRadius: '4px' }}>
                  {poi.category}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{poi.nearestStation.stationName}역 인근</span>
              </div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{poi.name}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{poi.address}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
