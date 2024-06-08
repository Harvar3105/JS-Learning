import Link from "next/link";
import Identity from "./Identity";

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm mb-3">
                <div className="container">
                    <Link href="/" className="header-text">Next App</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1 -text">
        

                                    <li className="nav-item">
                                        <Link href="/" className="nav-link header-text">
                                            Home
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/Avatar/" className="nav-link header-text">
                                            Avatar
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/Items/" className="nav-link header-text">
                                            Items
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/pages/Owns/" className="nav-link header-text">
                                            Owns
                                        </Link>
                                    </li>
                            
                        </ul>
                        <Identity/>
                    </div>
                </div>
            </nav>
    </header>
        );
}