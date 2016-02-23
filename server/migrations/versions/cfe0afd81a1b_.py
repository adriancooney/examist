"""Paper table.

Revision ID: cfe0afd81a1b
Revises: 009921b01ab6
Create Date: 2016-02-23 21:48:07.555304

"""

# revision identifiers, used by Alembic.
revision = 'cfe0afd81a1b'
down_revision = '009921b01ab6'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('paper',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('period', sa.String(), nullable=True),
    sa.Column('sitting', sa.Integer(), nullable=True),
    sa.Column('year_start', sa.Integer(), nullable=True),
    sa.Column('year_stop', sa.Integer(), nullable=True),
    sa.Column('module_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['module_id'], ['module.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('paper')
    ### end Alembic commands ###
