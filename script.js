function generateLifeGraph(event) {
    event.preventDefault();

    const dateInput = document.getElementById('birth-date').value;
    const expectancyInput = document.getElementById('life-expectancy').value;

    if (!dateInput) return;

    localStorage.setItem('birthDate', dateInput);
    localStorage.setItem('lifeExpectancy', expectancyInput);

    const birthDate = new Date(dateInput);
    birthDate.setHours(0, 0, 0, 0);

    const lifeExpectancy = parseInt(expectancyInput) || 96;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (birthDate > currentDate) {
        alert("You can't be from the future.");
        return;
    }

    let monthsLived = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 + (currentDate.getMonth() - birthDate.getMonth());
    if (monthsLived > 0 && currentDate.getDate() < birthDate.getDate()) {
        monthsLived -= 1;
    }

    const monthsExpected = lifeExpectancy * 12
    const monthsDelta = monthsExpected - monthsLived

    const graph = document.getElementById('graph');
    graph.innerHTML = '';

    for (let m = 0; m < Math.max(monthsLived, monthsExpected); m++) {
        const cell = document.createElement('span');
        cell.classList.add('cell');
        if (m < Math.min(monthsLived, monthsExpected)) {
            cell.classList.add('lived-expected');
        } else {
            if (monthsDelta >= 0) {
                cell.classList.add('unlived-expected');
            } else {
                cell.classList.add('lived-unexpected');
            }
        }
        graph.appendChild(cell);
    }

    const legend = document.getElementById('legend');
    document.querySelector('#legend .cell.lived-unexpected').closest('li').classList.toggle('hidden', monthsDelta >= 0);
    document.querySelector('#legend .cell.unlived-expected').closest('li').classList.toggle('hidden', monthsDelta <= 0);
    legend.classList.remove('hidden');

    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    const daysDelta = (endDate - currentDate) / (1000 * 60 * 60 * 24)

    const info = document.getElementById('info')
    const message = document.getElementById('message')

    if (daysDelta >= 0) {
        info.innerHTML = `You have <strong>${daysDelta}</strong> days left assuming a lifespan of ${lifeExpectancy} years.`;
        message.textContent = `There really is no time to waste.`
    } else {
        info.innerHTML = `You have lived <strong>${Math.abs(daysDelta)}</strong> days beyond the expected ${lifeExpectancy} years.`;
        message.textContent = `Every day, you break new ground.`
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const birthDate = localStorage.getItem('birthDate');
    const lifeExpectancy = localStorage.getItem('lifeExpectancy');
    if (birthDate) {
        document.getElementById('birth-date').value = birthDate;
    }
    if (lifeExpectancy) {
        document.getElementById('life-expectancy').value = lifeExpectancy;
    }
    document.getElementById('base').addEventListener('submit', generateLifeGraph);
})