import { Snippet} from 'react-instantsearch';


// Custom hit component to display image on the right and title on the left
function CustomHit({ hit }) {

    hit._snippetResult.description.value = hit._snippetResult.description.value.replace('&lt;em&gt;', '').replace('&lt;/em&gt;', '')
    console.log('hit', hit);
    return (
        <div className="hit-item">
          <div className='dish-details'>
            <div className='dish-name'>{hit.name}</div>
            <div className='dish-price'>Price: {hit.price}$</div>
            <Snippet hit={hit} attribute={"description"}/>
        
            
    
            </div>
          <img src={hit.img} alt={hit.name} />
        </div>
      );
    }


export default CustomHit;