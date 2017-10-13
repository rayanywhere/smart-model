const SmartModel = require('../');
const Logic = SmartModel.Logic;

SmartModel.setup('dev', `${__dirname}/models`, `${__dirname}/config`);

SmartModel.insert('user', {name:'ray'}).run();

SmartModel.count('user').where(
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

SmartModel.select('user', ['id', 'name']).where(
    Logic.statement('name', '=', 'ray')
).range(10, 20).run();

SmartModel.update('user', {name: 'tyson'}).limit(20).run();

SmartModel.delete('user').limit(20).run();
