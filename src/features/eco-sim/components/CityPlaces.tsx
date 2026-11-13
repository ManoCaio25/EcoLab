import { PLACES } from '../config/places';
export function CityPlaces({onVisit}:{onVisit:(id:string)=>void}){
  return <nav className="city-places" aria-label="Visitar lugares da cidade">
    <div className="eyebrow">CONHEÇA O DISTRITO</div>
    <div className="place-buttons">{PLACES.map((place,i)=><button key={place.id} onClick={()=>onVisit(place.id)} aria-label={`Visitar ${place.name}`}>
      <span className="place-index" style={{color:place.color}}>{String(i+1).padStart(2,'0')}</span>
      <span>{place.name}<small>{place.subtitle}</small></span><span aria-hidden="true">↗</span>
    </button>)}</div>
  </nav>;
}
