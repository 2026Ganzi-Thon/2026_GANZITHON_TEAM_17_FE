import {woolAssets} from './brand';
type Stage='THREAD'|'BALL'|'SCARF'|'SWEATER';
/** Original Figma exports supplied by the designer. */
export default function WoolArt({stage='BALL'}:{stage?:Stage}){return <div className={`wool-art wool-art-${stage.toLowerCase()}`}><span className="wool-star" aria-hidden="true">✦</span><img src={woolAssets[stage]} alt={{THREAD:'털 한 올',BALL:'털실 뭉치',SCARF:'목도리',SWEATER:'스웨터'}[stage]}/><span className="wool-spark" aria-hidden="true">✦</span></div>}
