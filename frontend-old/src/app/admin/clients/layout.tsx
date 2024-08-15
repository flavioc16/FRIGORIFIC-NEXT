import { Header } from "../dashboard/components/header"
export default function ClientsLayout({ children }: 
    { children: React.ReactNode }
){
    return(
        <>
            <Header/>
            {children}
        </>
    )
}