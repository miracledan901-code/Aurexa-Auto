// =========================================================================
// 1. GLOBAL STATE & AUTHENTICATION GATES (Option B Trigger)
// =========================================================================
let isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';

function attemptBooking(vehicleName) {
    if (isLoggedIn) {
        alert(`Access Granted. Opening checkout for: ${vehicleName}`);
        window.location.href = 'booking.html';
    } else {
        console.log(`Booking blocked for ${vehicleName} - Authentication required.`);
        openAuthModal();
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

function toggleAuthMode() {
    const loginForm = document.getElementById('loginFormContainer');
    const signupForm = document.getElementById('signupFormContainer');
    
    if (loginForm && signupForm) {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    }
}

function handleAuthSubmit(event, type) {
    event.preventDefault();
    localStorage.setItem('isUserLoggedIn', 'true');
    isLoggedIn = true;
    alert(`Auxera Security: ${type === 'login' ? 'Login' : 'Registration'} successful!`);
    closeAuthModal();
}

// =========================================================================
// 2. DYNAMIC VEHICLE DATABASE (Expanded with 8 Variants & Classification Tags)
// =========================================================================
const purchaseCars = [
    {
        name: "Porsche 911 GT3 RS",
        specs: "518 HP • Track Variant • Automatic",
        price: "$223,800",
        category: "new",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Tesla Roadster Concept",
        specs: "10,000 Nm Torque • Plaid EV • AWD",
        price: "$200,000",
        category: "electric",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Mercedes-AMG G 63",
        specs: "2023 Model • 12,000 mi • V8 Biturbo",
        price: "$165,000",
        category: "used",
        image: "https://media.ed.edmunds-media.com/mercedes-benz/g-class/2026/oem/2026_mercedes-benz_g-class_4dr-suv_amg-g-63_fq_oem_13_1600.jpg"
    },
    {
        name: "Audi e-tron GT RS",
        specs: "637 HP • Dual Motor EV • Quattro",
        price: "$147,100",
        category: "electric",
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Ferrari 458 Italia",
        specs: "2015 Model • 8,500 mi • Naturally Aspirated V8",
        price: "$239,000",
        category: "used",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop"
    }
];

const rentalCars = [
    {
        name: "Lamborghini Aventador SVJ",
        specs: "759 HP • V12 Engine • Active Aero",
        price: "$2,500",
        unit: "/ Day",
        category: "new",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Porsche Taycan Turbo S",
        specs: "750 HP • Electric Sports Sedan",
        price: "$950",
        unit: "/ Day",
        category: "electric",
        image: "https://www.batterydesign.net/wp-content/uploads/2024/02/Porsche-Taycan-facelift-2024-9.jpg"
    },
    {
        name: "Rolls-Royce Ghost",
        specs: "2021 Luxury Spec • V12 Twin-Turbo",
        price: "$3,200",
        unit: "/ Day",
        category: "used",
        image: "https://d3jvxfsgjxj1vz.cloudfront.net/news/wp-content/uploads/2024/03/01160933/2nd-Gen-Rolls-Royce-Ghost.jpg"
    }
];

// Global configuration tab placeholder flag
let currentMode = 'buy'; 

// =========================================================================
// 3. CONTROL FILTER PANEL ENGINE
// =========================================================================
function renderFleet() {
    const grid = document.getElementById('fleetGrid');
    const categoryFilter = document.getElementById('categoryDropdown').value;
    const searchInput = document.getElementById('carSearch').value.toLowerCase();
    
    if (!grid) return;
    grid.innerHTML = ''; // Wipe browser grid visualization space clean

    const activeFleet = (currentMode === 'buy') ? purchaseCars : rentalCars;

    // Filter calculations
    const filteredFleet = activeFleet.filter(car => {
        const matchesCategory = (categoryFilter === 'all') || (car.category === categoryFilter);
        const matchesSearch = car.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    if (filteredFleet.length === 0) {
        grid.innerHTML = `<p class="no-results">No luxury variants match your specific search criteria.</p>`;
        return;
    }

    // Generate dynamic DOM map structures
    filteredFleet.forEach(car => {
        const priceLabel = car.unit ? `${car.price}<span>${car.unit}</span>` : car.price;
        const actionLabel = car.unit ? "Reserve Rental" : "Inquire / Purchase";
        
        let tagText = car.category.toUpperCase();
        if(car.category === 'electric') tagText = '⚡ EV';

        const cardHTML = `
            <div class="car-card">
                <div class="car-img-wrapper">
                    <span class="category-badge badge-${car.category}">${tagText}</span>
                    <img src="${car.image}" alt="${car.name}">
                </div>
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <div class="car-specs">${car.specs}</div>
                    <div class="car-price-row">
                        <div class="car-price">${priceLabel}</div>
                        <button class="btn-premium btn-small" onclick="attemptBooking('${car.name}')">${actionLabel}</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

function switchMode(mode) {
    currentMode = mode;
    const tabBuy = document.getElementById('tabBuy');
    const tabRent = document.getElementById('tabRent');

    if (tabBuy && tabRent) {
        if (mode === 'buy') {
            tabBuy.classList.add('active');
            tabRent.classList.remove('active');
        } else {
            tabRent.classList.add('active');
            tabBuy.classList.remove('active');
        }
    }
    
    // Safety check resets
    const dropdown = document.getElementById('categoryDropdown');
    const search = document.getElementById('carSearch');
    if (dropdown) dropdown.value = 'all';
    if (search) search.value = '';
    
    renderFleet();
}

// Global state initialization controller
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentMode = urlParams.get('mode') || 'buy'; 
    switchMode(currentMode);
});

// =========================================================================
// 4. RESERVATION HANDLER ENGINE
// =========================================================================
function submitReservation(event) {
    event.preventDefault();
    
    const clientName = document.getElementById('bookFirst').value;
    const selectedCar = document.getElementById('bookVehicle').value;
    
    alert(`Clearance Confirmed! Thank you ${clientName}. Your secure asset allocation request for the ${selectedCar} has been logged in our operations data bank.`);
    
    // Clear the worksheet fields cleanly after registration notification
    document.getElementById('reservationForm').reset();
}