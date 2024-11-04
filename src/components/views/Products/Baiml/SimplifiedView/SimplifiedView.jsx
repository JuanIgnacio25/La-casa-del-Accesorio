import './simplifiedView.css';
import SimplifiedViewHeader from '@/components/views/Products/Baiml/SimplifiedView/SimplifiedViewHeader';
import SimplifiedViewCategories from '@/components/views/Products/Baiml/SimplifiedView/SimplifiedViewCategories';
import SimplifiedViewCards from '@/components/views/Products/Baiml/SimplifiedView/SimplifiedViewCards';

function SimplifiedView() {
  return (
    <div className='simplified-view-container'>
      <SimplifiedViewHeader/>
      <div className='simplified-view'>
        <SimplifiedViewCategories/>
        <SimplifiedViewCards/>
      </div>
    </div>
  )
}

export default SimplifiedView