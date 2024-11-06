class Room {
    constructor(number, capacity) {
      this.number = number;
      this.capacity = capacity;
      this.reservations = [];
    }
  
    isAvailable(date, startTime, duration) {
      for (let reservation of this.reservations) {
        if (reservation.date === date) {
          let reservedStart = new Date(`1970-01-01T${reservation.startTime}:00`);
          let reservedEnd = new Date(reservedStart.getTime() + reservation.duration * 3600000);
  
          let newStart = new Date(`1970-01-01T${startTime}:00`);
          let newEnd = new Date(newStart.getTime() + duration * 3600000);
  
          if ((newStart < reservedEnd && newEnd > reservedStart)) {
            return false;
          }
        }
      }
      return true;
    }
  
    addReservation(reservation) {
      this.reservations.push(reservation);
    }
  }
  
  class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
      this.name = name;
      this.roomNumber = roomNumber;
      this.date = date;
      this.startTime = startTime;
      this.duration = duration;
    }
  }
  
  const rooms = [new Room(101, 30), new Room(102, 20), new Room(103, 25)];
  const reservationsList = document.getElementById('reservations');
  const errorMessage = document.getElementById('error-message');
  
  function displayRooms() {
    const tableBody = document.querySelector('#rooms-table tbody');
    tableBody.innerHTML = '';
    rooms.forEach(room => {
      let row = document.createElement('tr');
      row.innerHTML = `<td>${room.number}</td><td>${room.capacity}</td><td>${room.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}</td>`;
      tableBody.appendChild(row);
    });
  }
  
  function makeReservation() {
    const name = document.getElementById('name').value;
    const roomNumber = parseInt(document.getElementById('room-number').value);
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const duration = parseInt(document.getElementById('duration').value);
  
    const room = rooms.find(r => r.number === roomNumber);
    if (!room) {
      errorMessage.textContent = 'Ruangan tidak ditemukan.';
      return;
    }
  
    if (!room.isAvailable(date, startTime, duration)) {
      errorMessage.textContent = 'Ruangan sudah dipesan di waktu tersebut.';
      return;
    }
  
    const reservation = new Reservation(name, roomNumber, date, startTime, duration);
    room.addReservation(reservation);
    displayReservations();
    displayRooms();
    errorMessage.textContent = '';
  }
  
  function displayReservations() {
    reservationsList.innerHTML = '';
    rooms.forEach(room => {
      room.reservations.forEach(reservation => {
        const listItem = document.createElement('li');
        listItem.textContent = `${reservation.name} - Ruangan ${reservation.roomNumber} - ${reservation.date} - ${reservation.startTime} - ${reservation.duration} jam`;
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Batalkan';
        cancelButton.onclick = () => cancelReservation(room, reservation);
        listItem.appendChild(cancelButton);
        reservationsList.appendChild(listItem);
      });
    });
  }
  
  function cancelReservation(room, reservation) {
    const index = room.reservations.indexOf(reservation);
    if (index > -1) {
      room.reservations.splice(index, 1);
      displayReservations();
      displayRooms();
    }
  }
  
  displayRooms();
  displayReservations();
  