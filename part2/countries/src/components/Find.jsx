
export const Find = (props) =>{
    const {newFilter,handleFilterChange} = props
    return(
      <div>
        <p>find countries <input value={newFilter} onChange={handleFilterChange}></input></p>
      </div>
    )
  }