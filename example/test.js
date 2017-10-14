const SmartModel = require('../');
const Logic = SmartModel.Logic;

SmartModel.setup('dev', `${__dirname}/models`, `${__dirname}/config`);

(async () => {
    try {
        await SmartModel.insert('user', {name:'ray'}).run();

        let counts = await SmartModel.count('user').where(
            Logic.and(
                [
                    Logic.statement('name', '=', 'ray'),
                    Logic.or([
                        Logic.statement('id', '=', '123123'),
                        Logic.statement('name', '=', 'rrsda')
                    ])
                ]
            )
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


