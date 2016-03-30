"""Question similarity.

Revision ID: eadd37a9a581
Revises: cf2e840ef9ee
Create Date: 2016-03-30 18:40:59.097644

"""

# revision identifiers, used by Alembic.
revision = 'eadd37a9a581'
down_revision = 'cf2e840ef9ee'

from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('similar_questions',
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('similar_question_id', sa.Integer(), nullable=False),
        sa.Column('similarity', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['question.id'], ),
        sa.ForeignKeyConstraint(['similar_question_id'], ['question.id'], ),
        sa.PrimaryKeyConstraint('question_id', 'similar_question_id')
    )

def downgrade():
    op.drop_table('similar_questions')
