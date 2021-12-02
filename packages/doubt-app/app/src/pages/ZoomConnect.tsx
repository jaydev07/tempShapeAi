import { useIonRouter, IonLoading } from "@ionic/react";
import { useEffect } from "react";
import { connectZoom } from '../api/stream';

const ZoomConnect = () => {
	const router = useIonRouter()
	useEffect(() => {
		console.log(router.routeInfo.pathname)
		console.log(router.routeInfo)
		const code = router.routeInfo.search.replace('?code=', '');
		connectZoom(code)
			.then(() => {
				router.push('/mentor/streams');
			})
		
	},[router.routeInfo]);
	return <>
		<p>
			:p
		</p>
		<IonLoading
			isOpen
		/>
	</>
}

export default ZoomConnect;