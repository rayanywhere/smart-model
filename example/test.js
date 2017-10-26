const SmartModel = require('../');
const Logic = SmartModel.Logic;

SmartModel.setup(`${__dirname}/models`, `${__dirname}/config`);

(async () => {
    try {
        await SmartModel.insert('user').data({name:'ray', id: '1003'}).run();
        await SmartModel.insert('user_statistic').data({id:'1003', name:'aaa', logins:3, logouts:2}).run();

        let counts = await SmartModel.count('user').where(
               Logic.statement('name', SmartModel.Ops.LIKE, '%ay%'),
        ).run();
        console.log(counts);

        let [row] = await SmartModel.select('user').join('user_statistic', 'left', 'id').where(
            Logic.statement('user.name', '=', 'ray')
        ).range(0, 20).run();
        console.log(row);
        
        await SmartModel.update('user').data({name: 'tyson'}).limit(20).run();
        
        await SmartModel.delete('user').limit(20).run();

        await SmartModel.delete('user_statistic').limit(20).run();
    }
    catch(err) {
        console.error(err.stack);
    }
})();


