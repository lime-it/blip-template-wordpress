import {expect, test} from '@oclif/test'

describe('template-wordpress:commit', () => {
  test
  .stdout()
  .command(['template-wordpress:commit'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:commit', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
