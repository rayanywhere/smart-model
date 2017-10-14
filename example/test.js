const SmartModel = require('../');
const Logic = SmartModel.Logic;

SmartModel.setup('dev', `${__dirname}/models`, `${__dirname}/config`);

(async () => {
    try {
        await SmartModel.insert('user', {name:'ray', id: '1003'}).run();

        let counts = await SmartModel.count('user').where(
               Logic.statement('name', SmartModel.Ops.LIKE, '%ay%'),
        ).run();
        console.log(counts);

        let records = await SmartModel.select('user', ['id', 'name']).where(
            Logic.statement('name', '=', 'ray')
        ).range(0, 20).run();
        console.log(records);
        
        await SmartModel.update('user', {name: 'tyson'}).limit(20).run();
        
        await SmartModel.delete('user').limit(20).run();
    }
    catch(err) {
        console.error(err.stack);
    }
})();


