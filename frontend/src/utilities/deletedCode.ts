// function handleDeleteTripClick(event: SyntheticEvent) {
//     const target = event.target as HTMLElement;
//     const cardId: string = target.id; 
//     const delIndex: number = parseInt(cardId.split('delete')[1]);
//     const json: string = JSON.stringify(trips.allTrips[delIndex]);
//     (async function() {
//         try {
//             const res: Response = await fetch(`/user/trips?userid=${user.id}`, {
//                 method: 'DELETE',
//                 body: json, 
//                 headers: fetchHelpers.getTokenJSONHeader(),
//             });
//             if (res.ok) {
//                 // Instead of deleting the trip individually from local state,
//                 // we will reload all trips to avoid any synchronization issues
//                 // between the frontend and backend
//                 getTrips();

//             } else {
//                 const obj = await res.json();
//                 throw new Error(obj);
//             }
//         } catch (e: any) {
//             console.error(e.message);
//         }
//     })();
// }

export default null;