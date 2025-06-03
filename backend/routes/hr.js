router.post('/assign-role', verifyToken, requireRole('HR'), async (req, res) => {
    const { email, role } = req.body;
    const validRoles = ['Student', 'Supervisor', 'HR'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    try {
        const updated = await internalPool.query(
            'UPDATE users SET role = $1 WHERE email = $2 RETURNING *',
            [role, email]
        );
        if (updated.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Role assigned successfully',
            user: updated.rows[0]
        });
    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({ error: 'Failed to assign role', details: error.message });
    }
});