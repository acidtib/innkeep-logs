const Tail = require('tail').Tail;
var events = require('events').EventEmitter;
var emitter = new events.EventEmitter();

emitter.on('game-start', function(data){
  console.log(data);
});

emitter.on('game-end', function(data){
  console.log(data)
});

emitter.on('found-player', function(data){
  console.log(data)
});

emitter.on('found-opponent', function(data){
  console.log(data)
});


module.exports = {
  start: function() {
    console.log("starting logWatcher")
    // var options= {fromBeginning: true, fsWatchOptions: {}, follow: true, logger: console}
    // tail = new Tail("C:\\Users\\kodamabit\\Desktop\\output_log_hearthstore.txt", options);
    tail = new Tail("C:\\Program Files (x86)\\Hearthstone\\Hearthstone_Data\\output_log.txt")

    tail.on("line", function(data) {
      if (match = data.match(/\[Power\] GameState\.DebugPrintPower\(\) -\s*CREATE_GAME/)) {
        emitter.emit('game-start', data)
      }

      if (data.match(/\[Power\] PowerTaskList\.DebugPrintPower\(\) -\s+TAG_CHANGE Entity=(.*) tag=PLAYSTATE value=(LOST|WON|TIED)/)) {
        emitter.emit('game-end', data)
      }

      if (player = data.match(/\[Power\] GameState\.DebugPrintGame\(\) - PlayerID=1, PlayerName=(.*)$/)) {
        emitter.emit('found-player', player[1])
      }

      if (opponent = data.match(/\[Power\] GameState.DebugPrintEntitiesChosen\(\) - id=2 Player=([^\s]+) EntitiesCount/)) {
        emitter.emit('found-opponent', opponent[1])
      }
    });
    
    tail.on("error", function(error) {
      console.log('ERROR: ', error);
    });
  }
}